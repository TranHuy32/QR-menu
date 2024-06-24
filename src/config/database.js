import  Sequelize  from 'sequelize';

const sequelize = new Sequelize('dbbackend', 'root', 'jvemind2k10506', {
  host: 'localhost',
  dialect:'mysql'
});
export default sequelize