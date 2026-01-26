let counter = 1;

exports.generatePassword = () => {
  const password = `pj@${String(counter).padStart(3, "0")}`;
  counter++;
  return password;
};
