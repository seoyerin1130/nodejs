const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const cors = require('cors');
const { sequelize } = require('./models');
const depthRouter = require('./routes/depth');
const employeeRouter = require('./routes/employee');

const app = express();

// CORS 설정 수정
app.use(
  cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // 여러 도메인 허용
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

sequelize.sync({ force: false })
  .then(() => console.log('데이터베이스 연결 성공'))
  .catch((err) => console.error(err));


app.get('/', (req, res) => res.send('홈 페이지'));
app.use('/depth', depthRouter);
app.use('/employee', employeeRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => console.log(app.get('port'), '번 포트에서 대기 중'));