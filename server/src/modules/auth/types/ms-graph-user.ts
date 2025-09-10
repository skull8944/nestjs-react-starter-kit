export type MsGraphUser = {
  mail: string;
  displayName: string;
  surname: string;
  userType: string;
  depId: string;
  department: string;
  id: string;
  /** 等於 emplid */
  mailNickname: string;
  officeLocation: string;
  businessPhones: string[];
};
