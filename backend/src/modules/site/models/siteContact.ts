import Sequelize from "sequelize";
import { Table, Model, Column, DataType, BelongsTo, ForeignKey} from "sequelize-typescript";
import { Site } from './site';
@Table({
  tableName: "siteContact",
  timestamps: true,
  paranoid: true,
})

export class SiteContact extends Model {
  @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,

  })
  id!: string;

  @ForeignKey(() => Site)
  @Column({
    type: Sequelize.UUID,
    allowNull: false,
  })
  siteId!: string;

  @BelongsTo(() => Site)
  sites?: Site;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  middleName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName!: string;


  @Column({
    type: Sequelize.STRING,
    allowNull: true,
  })
  email!: string;
  
  @Column({
    type: Sequelize.STRING,
    allowNull: true,
  })
  phone!: string;


  @Column({
    type: Sequelize.STRING,
    allowNull: false,
  })
  phoneType!: string;


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
}