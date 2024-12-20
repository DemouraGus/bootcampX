const { Pool } = require('pg');

const pool = new Pool({
  user: 'development',
  password: 'development',
  host: 'localhost',
  database: 'bootcampx',
});

const queryString = `
  SELECT DISTINCT teachers.name AS teacher, cohorts.name AS cohort_name
  FROM teachers
  JOIN assistance_requests ON teachers.id = assistance_requests.teacher_id
  JOIN students ON students.id = assistance_requests.student_id
  JOIN cohorts ON cohorts.id = students.cohort_id
  WHERE cohorts.name LIKE $1
  ORDER BY teachers.name;
  `;

const cohortName = process.argv[2];
const values = [`%${cohortName}%`];

pool
  .query(queryString, values)
  .then((res) => {
    res.rows.forEach((cohort) => {
      console.log(
        `${cohort.cohort_name}: ${cohort.teacher}`
      );
    });
  })
  .catch((err) => console.error('query error', err.stack));