import { getRouterManifest } from '@tanstack/react-start/router-manifest'
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'

import { createRouter } from './router'

const Root = createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler)

export default Root
