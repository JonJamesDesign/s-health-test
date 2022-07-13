import { useCallback, useState, ChangeEvent, SyntheticEvent } from 'react';

const SORT_COLS = [
  { value: 'firstName', label: 'First Name'},
  { value: 'lastName', label: 'Last Name' },
  { value: 'dob', label: 'Date of Birth' },
];
const SORT_DIRS = ['ASC', 'DESC'];

type Clinic = {
  name: string;
  patients: Array<{
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
  }>;
}

function App() {
  const [loadingClinic, setLoadingClinic] = useState<boolean>(false);
  const [clinic, setClinic] = useState<Clinic | undefined>(undefined);
  const [clinicId, setClinicId] = useState(1);
  const [sortCol, setSortCol] = useState('');
  const [sortDir, setSortDir] = useState(SORT_DIRS[0]);

  const fetchFromAPI = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoadingClinic(true);
    let url = `/api/clinic/${clinicId}`;
    if (sortCol) {
      url = url + `?sort_col=${sortCol}&sort_dir=${sortDir}`;
    }
    const res = await (await fetch(url)).json()
    setClinic(res);
    setLoadingClinic(false);
  }, [clinicId, sortCol, sortDir])

  const handleClinicSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setClinicId(Number(e.target.value));
  }, [])
  const handleSortColSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSortCol(e.target.value);
  }, [])
  const handleSortDirSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSortDir(e.target.value);
  }, [])

  return (
    <div className="App">
      <form onSubmit={fetchFromAPI}>
        <div className='form-control'>
          <label htmlFor="clinic">Select Clinic:</label>
          <select name="clinic" id="clinic" value={clinicId} onChange={handleClinicSelect}>
            <option value="1">Salve Fertility</option>
            <option value="2">London IVF</option>
          </select>
        </div>

        <div className='form-control'>
          <label htmlFor="sort-col">Sort Column:</label>
          <select name="sort-col" id="sort-col" value={sortCol} onChange={handleSortColSelect}>
            <option value="">-</option>
            {SORT_COLS.map((col) => <option key={col.value} value={col.value}>{col.label}</option>)}
          </select>
        </div>

        {sortCol && (
          <div className='form-control'>
            <label htmlFor="sort-dir">Sort Direction:</label>
            <select name="sort-dir" id="sort-dir" value={sortDir} onChange={handleSortDirSelect}>
              {SORT_DIRS.map((dir) => <option key={dir} value={dir}>{dir}</option>)}
            </select>
          </div>
        )}

        <button type="submit">Fetch Data</button>
      </form>

      {loadingClinic && <p><strong>Loading &hellip;</strong></p>}

      {!loadingClinic && clinic && (
        <>
          <h2>{clinic.name}</h2>
          <ul>{clinic.patients.map((p) => <li key={p.id}>{p.firstName} {p.lastName} - {p.dob}</li>)}</ul>
        </>
      )}
    </div>
  );
}

export default App;
