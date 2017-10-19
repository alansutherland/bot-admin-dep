import memoize from 'lru-memoize';
import {createValidator, required, maxLength} from 'utils/validation';

const ownersValidation = createValidator({
  emailadd: [required, maxLength(100)]
});
export default memoize(10)(ownersValidation);
