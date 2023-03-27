import Sequelize from "sequelize";
import { Table, Model, Column, DataType, HasMany, BelongsTo } from "sequelize-typescript";
import {SiteTenant} from'./siteTenant';
import {SiteContact} from'./siteContact';

@Table({
  tableName: "sites",
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
export class Site extends Model {
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
  name!: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  address!: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: true,
  })
  longitude!: string;


  @Column({
    type: Sequelize.STRING,
    allowNull: true,
  })
  latitude!: string;

  @Column({
    type: Sequelize.STRING,
    allowNull: true,
  })
  siteIdentifier!: string;


  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['Active', 'Inactive','Deleted'],
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




  @HasMany(() => SiteTenant, {
    onDelete: 'CASCADE',
    hooks: true
})
 siteTenant?: SiteTenant[];


 @HasMany(() => SiteContact, {
  onDelete: 'CASCADE',
  hooks: true
})
siteContact?: SiteContact[];

}