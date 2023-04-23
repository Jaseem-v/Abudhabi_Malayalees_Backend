export interface ICategory {
  name: string;
  image: {
    key: string;
    mimetype: string;
  };
  status: "Active" | "Inactive";
  visibility: "Show" | "Hide";
  isDeleted: boolean;
  deletedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}
