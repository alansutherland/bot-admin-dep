import memoize from 'lru-memoize';
import {createValidator, required} from 'utils/validation';

const channelsValidation = createValidator({
  token: [required]
});
export default memoize(10)(channelsValidation);
