'use strict'
module.exports = (sequelize, DataTypes) => {
  const JobUser = sequelize.define('JobUser', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    jobId: DataTypes.INTEGER, // 1: Qualification, 2: Training, 3: Rating
    startTime: DataTypes.DATE,
    finishTime: DataTypes.DATE,
    expirationTime: DataTypes.DATE,
    validity: DataTypes.JSON,
    actionsTracking: DataTypes.JSON,
    clientUUID: DataTypes.UUID
  },
  {
    timestamps: false
  })
  JobUser.associate = function (models) {
    // associations can be defined here
    JobUser.belongsTo(models.User), // eslint-disable-line
    JobUser.belongsTo(models.JobUser, {
      as: 'ListeningTest',
      foreignKey: 'ListeningTestId'
    })
  }
  return JobUser
}
