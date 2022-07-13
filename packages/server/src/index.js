const csv = require('csv-parser');
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const morgan = require('morgan');

const PORT = 3001;
const app = express();

// Helmet sets various HTTP headers; https://github.com/helmetjs/helmet#how-it-works
app.use(helmet());

// HTTP request logger middleware; https://github.com/expressjs/morgan#options
app.use(morgan('combined'));

app.get('/api/clinic/:id', async (req, res) => {
  const clinicId = req.params.id;
  const sortCol = req.query['sort_col'];
  const sortDir = req.query['sort_dir'] || 'ASC';

  const getClinicName = new Promise((resolve) => {
    let clinicName = '';
    fs.createReadStream(`${__dirname}/data/clinics.csv`)
      .pipe(csv())
      .on('data', (row) => {
        if (Number(row.id) === Number(clinicId)) {
          clinicName = row.name
        }
      })
      .on('end', () => {
        console.log('clinics.csv successfully processed');
        resolve(clinicName);
      });
  });

  const getClinicPatients = new Promise((resolve) => {
    let patients = [];
    fs.createReadStream(`${__dirname}/data/patients-${clinicId}.csv`)
      .pipe(csv())
      .on('data', (row) => {
        patients.push({
          id: row['id'],
          firstName: row['first_name'],
          lastName: row['last_name'],
          dob: row['date_of_birth'],
        })
      })
      .on('end', () => {
        console.log(`patients-${clinicId}.csv successfully processed`);
        resolve(patients);
      })
  });

  const [clinicName, clinicPatients] = await Promise.all([getClinicName, getClinicPatients]);

  const clinic = {
    name: clinicName,
    patients: clinicPatients
  };

  if (sortCol) {
    const validsortCols = ['firstName', 'lastName', 'dob'];
    const validsortDirs = ['ASC', 'DESC'];

    if (!validsortCols.includes(sortCol)) {
      res.status(400).send(`Invalid sort_col: ${sortCol}`)
    }

    if (!validsortDirs.includes(sortDir.toUpperCase())) {
      res.status(400).send(`Invalid sort_dir: ${sortDir}`)
    }

    if (['firstName', 'lastName'].includes(sortCol)) {
      clinic.patients = clinic.patients.sort((a, b) => {
        const nameA = a[sortCol].toLowerCase();
        const nameB = b[sortCol].toLowerCase();
        return sortDir === 'ASC'
          ? (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
          : (nameB < nameA) ? -1 : (nameB > nameA) ? 1 : 0;
      })
    }

    if (sortCol === 'dob') {
      clinic.patients = clinic.patients.sort(
        (a, b) => sortDir === 'ASC'
          ? new Date(a.dob) - new Date(b.dob)
          : new Date(b.dob) - new Date(a.dob)
      );
    }
  }

  res.send(clinic);
});

app.listen(PORT, () => console.log(`📡 s-health-test:server listening on port ${PORT}`));
