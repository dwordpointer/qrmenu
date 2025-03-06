import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('defaultdb', 'avnadmin', 'AVNS_G-7wNAlU8PDN1VhGlD2', {
  host: 'mysql-1a330cf0-kamilbatuhancan-abe8.g.aivencloud.com',
  port: 13591,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    timestamps: false,
  },
  logging: false,
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Mysql  ->    Connected');
  } catch (err) {
    console.log('ConnErr->    ' + err);
  }
};
connect();

export default sequelize;
