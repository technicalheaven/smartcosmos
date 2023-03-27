import Sequelize from "sequelize";
import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "resetPasswords",
  timestamps: true
})

export class ResetPassword extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username!: string;
  
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  token!: string;

  // createdAt, lastUpdatedAt and deletedAt managed by Sequelize
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  })
  createdAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  })
  updatedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  deletedAt!: string;
}