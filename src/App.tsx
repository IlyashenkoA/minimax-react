import { ChangeEvent, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { AlertColor, Box, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

import Number from './components/Number'
import ActionAlert from './components/ActionsAlert'

import { RootState } from './store/reducers'
import { resetCombination } from './store/action-creators/action-creators'

import { computerMove, getWinner, humanMove, isGameOver } from './minimax/minimax'

export enum Players {
  HUMAN = 'HUMAN',
  COMPUTER = 'COMPUTER'
}

enum localStorageKey {
  ROW_LENGTH = 'ROW_LENGTH',
  WHO_START = 'WHO_START',
  ROW = 'ROW'
}

interface IAlert {
  severity: AlertColor,
  title: string,
  message: string
}

const LENGTH = 10;

const App: React.FC = () => {
  const [whoStart, setWhoStart] = useState<string>('');
  const [startStatus, setStartStatus] = useState<boolean>(false);
  const [moveButtonStatus, setMoveButtonStatus] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertData, setAlertData] = useState<IAlert>(Object);
  const [resetCheckbox, setResetCheckbox] = useState<boolean>(false);
  const [rowLength, setRowLength] = useState<number>(LENGTH);
  const [row, setRow] = useState<string[]>(getDefaultRow());

  function getDefaultRow() {
    const localRow = localStorage.getItem(localStorageKey.ROW);
    const localRowLength = +localStorage.getItem(localStorageKey.ROW_LENGTH)!;
    const whoStart = localStorage.getItem(localStorageKey.WHO_START);

    return localRow &&
      whoStart &&
      localRowLength &&
      JSON.parse(localRow).length > 2
      ? JSON.parse(localRow)
      : Array.from({ length: rowLength }, () =>
        Math.floor(Math.random() * 2).toString()
      )
  }

  const saveLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
  }

  useEffect(() => {
    if ((row.length > 2 && row.length < +localStorage.getItem(localStorageKey.ROW_LENGTH)!) && localStorage.getItem(localStorageKey.WHO_START)) {
      setStartSettings();
      setWhoStart(localStorage.getItem(localStorageKey.WHO_START)!);
    }
  }, [])

  // Create a row when length was changed
  useEffect(() => {
    if ((row.length > 2 && row.length < +localStorage.getItem(localStorageKey.ROW_LENGTH)!) && localStorage.getItem(localStorageKey.WHO_START)) return;

    setRow(createRow(rowLength));
    saveLocalStorage(localStorageKey.ROW_LENGTH, rowLength.toString());
  }, [rowLength])

  useEffect(() => {
    /**
     * In case in previous game was started by Computer and next game has started without any changes
     * (Start button has been pressed immediately after previous game has been finished)
     * Computer step will be made, when a new row will be created
     */
    if (row.length === rowLength && whoStart === Players.COMPUTER && startStatus) {
      const defaultArray = [...row];
      const step = computerMove(defaultArray);

      setAlertData({ severity: 'info', title: 'Step', message: `Computer step: ${row.join('-')} => ${step.join('-')}` });
      setShowAlert(true);

      // Computer make a move
      setRow(step);
    }
    saveLocalStorage(localStorageKey.ROW, JSON.stringify(row));
  }, [row])

  const createRow = (rowLength: number) => {
    return Array.from({ length: rowLength }, () =>
      Math.floor(Math.random() * 2).toString());
  }

  const combination = useSelector((state: RootState) => {
    return state.CombinationReducer.combination;
  });

  const dispatch = useDispatch();

  const onStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWhoStart(e.target.value);
  };

  const onMoveClick = () => {
    const sortCombination = combination.sort((a, b) => {
      return a.key - b.key;
    });

    /**
     * The condition verifies that only two adjacent numbers are selected.
     *
     * If the condition is met, the human move is fulfilled.
     */
    if (combination.length > 2 || combination.length < 2) {
      setAlertData({ severity: 'warning', title: 'Warning', message: 'You have to choose two numbers' });
      setShowAlert(true);

      return;
    }

    if (sortCombination[1].key - sortCombination[0].key > 1 || sortCombination[1].key - sortCombination[0].key < 1) {
      setAlertData({ severity: 'warning', title: 'Warning', message: 'You have to choose two adjacent numbers' });
      setShowAlert(true);

      return;
    }

    // Update row after player made a move
    setRow(humanMove(row, combination));

    // Reset previous combination of the numbers
    dispatch(resetCombination());

    // Checking if the game is over and displaying a message about who won
    if (isGameOver(row)) {
      setAlertData({ severity: 'success', title: 'Winner:', message: getWinner(row, whoStart) });
      setShowAlert(true);

      setMoveButtonStatus(true);
      setStartStatus(false);
      setResetCheckbox(true);

      localStorage.clear();

      return;
    }

    const defaultArray = [...row];
    const step = computerMove(defaultArray);

    setAlertData({ severity: 'info', title: 'Step', message: `Computer step: ${row.join('-')} => ${step.join('-')}` });
    setShowAlert(true);

    // Computer make a move and update row
    setRow(step);
    setResetCheckbox(true);

    // Checking if the game is over and displaying a message about who won
    if (isGameOver(step)) {
      setAlertData({ severity: 'success', title: 'Winner:', message: getWinner(step, whoStart) });
      setShowAlert(true);

      setMoveButtonStatus(true);
      setStartStatus(false);
      setResetCheckbox(true);

      localStorage.clear();
    }
  };

  /**
    * Configurations when the game started:
    *
    * 1. Disable alert if is shown
    * 2. Enable Move button
    * 3. Disable Start/Repeat button until the end of the game
  */
  const setStartSettings = () => {
    setShowAlert(false);
    setMoveButtonStatus(false);
    setStartStatus(true);
  }

  const setStopSettings = () => {
    setShowAlert(false);
    setMoveButtonStatus(true);
    setStartStatus(false);
    setWhoStart('');

    // Delete row from localStorage
    localStorage.clear();

    setRow(createRow(rowLength));
  }

  const onStartClick = () => {
    switch (whoStart) {
      case Players.HUMAN:
        setStartSettings();
        saveLocalStorage(localStorageKey.ROW_LENGTH, rowLength.toString());
        saveLocalStorage(localStorageKey.ROW, JSON.stringify(row));
        saveLocalStorage(localStorageKey.WHO_START, Players.HUMAN);

        // If a game has been played, create a new row of numbers
        if (isGameOver(row)) {
          setRow(createRow(rowLength));
        }


        break;
      case Players.COMPUTER:
        setStartSettings();
        saveLocalStorage(localStorageKey.ROW_LENGTH, rowLength.toString());
        saveLocalStorage(localStorageKey.ROW, JSON.stringify(row));
        saveLocalStorage(localStorageKey.WHO_START, Players.COMPUTER);

        // If a game has been played, create a new row of numbers
        if (isGameOver(row)) {
          setRow(createRow(rowLength));
        }

        if (row.length === 2) break;

        const step = computerMove(JSON.parse(localStorage.getItem(localStorageKey.ROW)!));

        setAlertData({ severity: 'info', title: 'Step', message: `Computer step: ${row.join('-')} => ${step.join('-')}` });
        setShowAlert(true);

        // Computer make a move
        setRow(step);

        break;
      default:
        setAlertData({ severity: 'warning', title: 'Warning', message: 'You have to choose who starts the move.' });
        setShowAlert(true);
    }
  }

  const onStopClick = () => {
    setStopSettings();
  }

  const handleRowLength = (e: SelectChangeEvent<number>) => {
    setRowLength(+e.target.value);
  }

  return (
    <>
      {showAlert && <ActionAlert severity={alertData.severity} title={alertData.title} message={alertData.message} />}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid
          container
          spacing={4}
          style={{ width: '70vw', margin: '0 auto' }}
        >
          <Grid item xs={12}
            height="25vh"
            border="4px solid #1976D2"
            style={{ padding: "0" }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', margin: '0 20px', height: '100%' }}>
              {row.map((value: string | number, index: number) => {
                return (
                  <Number key={index} position={index} value={+value} disabled={moveButtonStatus} reset={resetCheckbox} setReset={setResetCheckbox} />
                )
              })}
            </Box>
          </Grid>
          <Grid item xs={6} height="30vh" style={{ paddingLeft: '0' }}>
            <Grid
              container
              spacing={2}
              style={{ marginLeft: '0' }}
              columnSpacing={4}
            >
              <Grid item xs={6} style={{ paddingLeft: '0' }}>
                <Button variant="contained" disabled={moveButtonStatus} onClick={onMoveClick}>Make a Move</Button>
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={6} style={{ paddingLeft: '0' }}>
                <RadioGroup onChange={onStartChange}>
                  <FormControlLabel value={Players.HUMAN} control={<Radio disabled={startStatus} checked={whoStart === Players.HUMAN} />} label="Human" />
                  <FormControlLabel value={Players.COMPUTER} control={<Radio disabled={startStatus} checked={whoStart === Players.COMPUTER} />} label="Computer" />
                </RadioGroup>
              </Grid>
              <Grid item xs={6} style={{ paddingLeft: '0' }}>
                <FormControl sx={{ width: '150px' }}>
                  <InputLabel id="demo-simple-select-label">Row length</InputLabel>
                  <Select
                    defaultValue={rowLength}
                    value={rowLength}
                    onChange={handleRowLength}
                    disabled={startStatus}
                  >
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} style={{ paddingLeft: '0' }}>
                <Button variant="contained" onClick={onStartClick} disabled={startStatus}>Start/Repeat</Button>
              </Grid>
              <Grid item xs={6} style={{ paddingLeft: '0' }}>
                <Button variant="outlined" onClick={onStopClick} sx={{ width: '150px' }}>Stop</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default App
