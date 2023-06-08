type TableManagementS = {
  name: string;
  nickname: string;
  password: string;
  status: 0 | 1 | -1; // '状态 0审核中 -1不可用 1正常',
  cover: number;
  level: number;
};

type TableManagementR = {
  cover: string;
  password: string;
  createDate: string;
};

type TableManagement = TableManagementS & TableManagementR;
