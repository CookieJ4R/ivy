export type Tag = {
  id: number;
  name: string;
  color: string;
  created_at: Date;
};

export type CreateTagInput = {
  name: string;
  color: string;
};

export type TagUsage = {
  used: number;
  unused: number;
};
