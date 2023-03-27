import Sequelize from "sequelize";
import { Table, Model, Column, DataType, HasMany, } from "sequelize-typescript";
import {TenantContact} from'./tenantContact';
import {TenantFeature} from'./tenantFeature';


@Table({
  tableName: "tenants",
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

export class Tenant extends Model {
  @Column({
      type: DataType.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,

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
  description!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  contact!: string;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['Active', 'Inactive','Deleted'],
    defaultValue: 'Active',
  })
  status!: string;
  
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['smartcosmos','tenant', 'subTenant'],
    defaultValue: 'tenant',
  })
  type!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
   })
  parent!: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
   })
   path!: string;

   @Column({
    type: DataType.STRING,
    allowNull: true,
   })
   logo!: string;

   @Column({
    type: DataType.STRING,
    allowNull: true,
   })
   address!: string;


   @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue:false,
   })
   archived!: string;
  

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

 @HasMany(() => TenantContact, {
  onDelete: 'CASCADE',
  hooks: true
})
tenantContact?: TenantContact[];

@HasMany(() => TenantFeature, {
  onDelete: 'CASCADE',
  hooks: true
})
tenantFeatures?: TenantFeature[];
}


