interface IUpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  language?: string;
  phone?: string;
  image?: string | Buffer | null;
  gender?: string | null;
  birthdate?: Date | null;
}

export default IUpdateUserDTO;
