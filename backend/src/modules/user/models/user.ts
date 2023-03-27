import Sequelize from "sequelize";
import { Table, Model, Column, DataType, HasMany, HasOne } from "sequelize-typescript";
import {UserRole} from'./userRole';

@Table({
  tableName: "users",
  paranoid: true,
  timestamps: true,
  hooks: {
    // afterDestroy: (instance, options) => {
    //   instance.getUserRoles().then((userRoles) => {
    //     userRoles.forEach(userRole => {
    //       userRole.destroy(options);
    //     });
    //   }

    //   ); // Softdelete on userrole table
    // }
  }
})

export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue:DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  gender!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:true,

  })
  username!: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:true,
  })
  email!: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  contact!: string;

  @Column({
    type: DataType.ENUM('active','inactive','invited','deleted'),
    allowNull: false,
  })
  status!: string;
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  emailVerifiedAt!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  azureId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  createdBy!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  updatedBy!: string;
  
  
  
  
  // createdAt, lastUpdatedAt and deletedAt managed by Sequelize
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  })
  createdAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  updatedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  deletedAt!: string | null;






  @HasOne(() => UserRole, {
    onDelete: 'CASCADE',
    hooks: true
})
  userRole?: UserRole[];
}