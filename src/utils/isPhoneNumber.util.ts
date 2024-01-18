const isPhoneNumber = (phone_number: string): boolean => {
  return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(
    phone_number
  );
};

export default isPhoneNumber;
