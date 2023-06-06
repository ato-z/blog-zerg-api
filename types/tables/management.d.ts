type TableManagementS = {
  name: string;
  password: string;
  cover: number;
  level: number;
};

type TableManagementR = {
  cover: string;
  password: string;
  status: 0 | 1 | -1; // '状态 0审核中 -1不可用 1正常',
  createDate: string;
};

type TableManagement = TableManagementS & TableManagementR;
