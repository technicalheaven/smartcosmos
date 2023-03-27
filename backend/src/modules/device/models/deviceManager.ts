import Sequelize from "sequelize";
import { Table, Model, Column, DataType, HasMany, BelongsTo } from "sequelize-typescript";



@Table({
  tableName: "deviceManager",
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
export class DeviceManager extends Model {
  @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,

  })
  id!: string;

  @Column({
    type: Sequelize.UUID,
    allowNull: false,
  })
  tenantId!: string;

  @Column({
    type: Sequelize.UUID,
    allowNull: true,
    defaultValue:null

  })
  uuid!: string;


  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  url!: string;

  @Column({
    type: Sequelize.ENUM,
    values: ['onPremise', 'onCloud'],
    allowNull: false,
    defaultValue:'onPremise',
  })
  type!: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['Active', 'Inactive'],
    defaultValue: 'Active',
  })
  status!: string;
  
  // createdAt, lastUpdatedAt and deletedAt managed by Sequelize
  
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
    type: DataType.UUID,
    allowNull: true,
  })
  lastSyncAt!: string;

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

}