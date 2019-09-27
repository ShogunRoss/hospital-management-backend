export default (res, token) => {
  res.cookie('jid', token, {
    httpOnly: true,
    path: '/refresh-token',
  });
};
