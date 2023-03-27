import Sequelize from "sequelize";
import { Table, Model, Column, DataType, HasMany, BelongsTo,ForeignKey } from "sequelize-typescript";
import { DeviceConfig } from './deviceConfig';


@Table({
  tableName: "deviceTypeModel",
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

export class DeviceTypeModel extends Model {
  
 
  @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,

  })
  id!: string;
 
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  model!: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: true,
  })
  modelType!: string;
  
  
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
    allowNull: true,
    defaultValue: null,
  })
  deletedAt!: string;


  @HasMany(() => DeviceConfig, {
    onDelete: 'CASCADE',
    hooks: true
  })
  DeviceConfig?: DeviceConfig[];

  
}