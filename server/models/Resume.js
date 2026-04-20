const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetRole: {
    type: DataTypes.STRING,
  },
  targetDescription: {
    type: DataTypes.TEXT,
  },
  extractedText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  analysis: {
    type: DataTypes.JSONB,
  },
});

module.exports = Resume;
