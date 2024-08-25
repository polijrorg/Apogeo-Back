interface IUpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  language?: string;
  phone?: string;
  image?: string;
  gender?: string;
  birthdate?: Date;
}

export default IUpdateUserDTO;
