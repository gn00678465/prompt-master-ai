"""
API 路由：模板管理
"""
from datetime import datetime, timezone
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select, or_, and_
from schemas.template import TemplateOut, TemplateCreate, TemplateUpdate
from app.dependencies import SessionDep, get_current_user
from app.models.user import User
from app.models.template import Template

router = APIRouter(
    prefix="/v1/templates",
    tags=["templates"],
    responses={404: {"description": "Not found"}},
)


@router.get('/', response_model=List[TemplateOut])
async def get_all_templates(data: Annotated[User, Depends(get_current_user)], session: SessionDep):
    """
    獲取所有模板（包含用戶模板和預設模板）
    """
    user_id = data.user_id
    # 查詢條件：用戶的模板 OR 預設模板
    templates = session.exec(
        select(Template).where(
            or_(
                Template.user_id == user_id,
                Template.is_default
            )
        )
    ).all()
    return templates


@router.get('/{template_id}', response_model=TemplateOut)
async def get_template_by_id(
    data: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    template_id: int
):
    """
    根據模板 ID 獲取模板詳細資訊
    """
    user_id = data.user_id
    # 查詢條件：模板 ID 匹配且屬於當前用戶或為預設模板
    template = session.exec(
        select(Template).where(
            and_(
                Template.template_id == template_id,
                or_(
                    Template.user_id == user_id,
                    Template.is_default
                )
            )
        )
    ).first()

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"模板 ID {template_id} 不存在"
        )

    return template


@router.post('/')
async def create_template(
    data: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    template: TemplateCreate
):
    """
    建立新的模板
    """
    user_id = data.user_id

    # 檢查同名模板是否已存在
    existing_template = session.exec(
        select(Template).where(
            and_(
                Template.user_id == user_id,
                Template.name == template.name
            )
        )
    ).first()

    if existing_template:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"模板名稱 '{template.name}' 已存在"
        )

    new_template = Template(
        user_id=user_id,
        name=template.name,
        description=template.description,
        content=template.content,
        is_default=False,  # 預設不設為預設模板
        category=template.category or 'Custom'  # 如果沒有指定分類，預設為 'Custom'
    )

    session.add(new_template)
    session.commit()
    session.refresh(new_template)

    return new_template


@router.put('/{template_id}')
async def update_template(
    data: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    template_id: int,
    template: TemplateUpdate
):
    """
    更新模板資訊
    """
    user_id = data.user_id
    existing_template = session.exec(
        select(Template).where(
            and_(
                Template.template_id == template_id,
                Template.user_id == user_id
            )
        )
    ).first()

    if not existing_template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"模板 ID {template_id} 不存在"
        )

    # 只更新有傳入的欄位
    update_data = template.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(existing_template, field, value)

    # 更新時間戳
    existing_template.updated_at = datetime.now(timezone.utc)

    session.add(existing_template)
    session.commit()
    session.refresh(existing_template)

    return existing_template


@router.delete('/{template_id}')
async def delete_template(
    data: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    template_id: int,
):
    """
    刪除模板
    """
    user_id = data.user_id
    existing_template = session.exec(
        select(Template).where(
            and_(
                Template.template_id == template_id,
                Template.user_id == user_id
            )
        )
    ).first()

    if not existing_template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"模板 ID {template_id} 不存在"
        )

    session.delete(existing_template)
    session.commit()

    return {"message": f"模板 ID {template_id} 已成功刪除"}
