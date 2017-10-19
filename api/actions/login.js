export default function login(req) {
  const data = req.body.name.split('&email=');
  const user = {
    name: data[0],
    email: data[1]
  };
  req.session.user = user;
  return Promise.resolve(user);
}
