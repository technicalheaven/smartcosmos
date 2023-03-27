import Sequelize from "sequelize";
import { Table, Model, Column, DataType,BelongsTo, ForeignKey } from "sequelize-typescript";
import { Feature } from './feature';
@Table({
  tableName: "featureActions",
  timestamps: true,
})

export class FeatureAction extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => Feature)
  @Column({
    type: Sequelize.UUID,
    allowNull: false,
  })
  featureId!: string;

  @BelongsTo(() => Feature)
  features?: Feature;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

 

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue:true,
  })
  isActive!: string;
   
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue:false,
  })
  isPredefined!: string;

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