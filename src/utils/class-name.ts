import _bem from 'bem-ts'
import { NAMESPACE } from '@/constants'

export function bem(block: string) {
  return _bem(block, {
    namespace: NAMESPACE,
    strict: false
  })
}
