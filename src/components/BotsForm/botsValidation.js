import memoize from 'lru-memoize';
import {createValidator, required, maxLength} from 'utils/validation';

const botsValidation = createValidator({
  id: [required, maxLength(100)],
  name: [required, maxLength(100)]
});
export default memoize(10)(botsValidation);
