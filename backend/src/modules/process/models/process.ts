import Sequelize from "sequelize";
import { UUID } from "sequelize";
import { Table, Model, Column, DataType, HasOne} from "sequelize-typescript";
import {ProcessDevice} from "./processDevice"

@Table({
  tableName: "processes",
  paranoid: true,
  timestamps: true,
})

export class Process extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id!: string;


  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  tenantId!: string;


  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue:null
  })
  processType!: string;

@Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue:null
  })
  processTypeName!: string;

  @Column({
    type: DataType.STRING,
    allowNull:true
  })
  description!: string;


  @Column({
    type: DataType.UUID,
    allowNull: true,
    defaultValue: DataType.UUIDV4
  })
  initialState!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  states!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  transitions!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  assign!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: Sequelize.NOW,
  })
  stopActions!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: Sequelize.NOW,
  })
  startActions!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  instruction!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  minStationVer!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isFinalized!: string;
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue:false
  })
  isPredefined!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue:false
  })
  isCustomizedLoop!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue:0 
   })
   startLoop!: string;
   
  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue:[]
  })
  actions!: string;


  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue:[]
  })
  steps!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue:''
  })
  workflowName!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isShared!: string;

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
    allowNull:true,
    defaultValue: null,
  })
  updatedAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  deletedAt!: string;

  @HasOne(() => ProcessDevice, {
    onDelete: 'CASCADE',
    hooks: true
  })
  processDevices?: ProcessDevice[];
}



