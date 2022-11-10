import { ChangeEvent, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { AlertColor, Box, FormControlLabel, Grid } from '@mui/material'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

import Number from './components/Number'
import ActionAlert from './components/ActionsAlert'

import { RootState } from './store/reducers'
import { createRow, resetCombination, updateRow } from './store/action-creators/action-creators'

import { computerMove, getWinner, humanMove, isGameOver } from './minimax/minimax'

export enum Players {
  HUMAN = 'HUMAN',
  COMPUTER = 'COMPUTER'
}

interface IAlert {
  severity: AlertColor,
  title: string,
  message: string
}

const App: React.FC = () => {
  const [whoStart, setWhoStart] = useState<string>('');
  const [startStatus, setStartStatus] = useState<boolean>(false);
  const [moveButtonStatus, setMoveButtonStatus] = useState<boolean>(true);

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertData, setAlertData] = useState<IAlert>(Object);

  const [resetCheckbox, setResetCheckbox] = useState<boolean>(false);

  const dispatch = useDispatch();

  const row = useSelector((state: RootState) => {
    return state.RowReducer.row
  });

  const combination = useSelector((state: RootState) => {
    return state.CombinationReducer.combination;
  });

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
    dispatch(updateRow(humanMove(row, combination)));

    // Reset previous combination of the numbers
    dispatch(resetCombination());

    // Checking if the game is over and displaying a message about who won
    if (isGameOver(row)) {
      setAlertData({ severity: 'success', title: 'Winner:', message: getWinner(row, whoStart) });
      setShowAlert(true);
      setMoveButtonStatus(true);

      return;
    }

    const step = computerMove(row);

    setAlertData({ severity: 'info', title: 'Step', message: `Computer step: ${row.join('-')} => ${step.join('-')}` });
    setShowAlert(true);

    // Computer make a move and update row
    dispatch(updateRow(step));
    setResetCheckbox(true);

    // Checking if the game is over and displaying a message about who won
    if (isGameOver(row)) {
      setAlertData({ severity: 'success', title: 'Winner:', message: getWinner(row, whoStart) });
      setShowAlert(true);
      setMoveButtonStatus(true);
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

    dispatch(createRow());
  }

  const onStartClick = () => {
    switch (whoStart) {
      case Players.HUMAN:
        setStartSettings();

        // If a game has been played, create a new row of numbers
        if (row.length === 2) {
          dispatch(createRow())
        }
        break;
      case Players.COMPUTER:
        setStartSettings();

        // If a game has been played, create a new row of numbers
        if (row.length === 2) {
          dispatch(createRow())
        }

        const step = computerMove(row);

        setAlertData({ severity: 'info', title: 'Step', message: `Computer step: ${row.join('-')} => ${step.join('-')}` });
        setShowAlert(true);

        // Computer make a move
        dispatch(updateRow(step));
        break;
      default:
        setAlertData({ severity: 'warning', title: 'Warning', message: 'You have to choose who starts the move.' });
        setShowAlert(true);
    }
  }

  const onStopClick = () => {
    setStopSettings();
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
              {row.map((value, index) => {
                return (
                  <Number key={index} position={index} value={+value} disabled={moveButtonStatus} reset={resetCheckbox} setReset={setResetCheckbox}/>
                )
              })}
            </Box>
          </Grid>
          <Grid item xs={4} height="30vh" style={{ paddingLeft: '0' }}>
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
                  <FormControlLabel value={Players.HUMAN} control={<Radio disabled={startStatus} />} label="Human" />
                  <FormControlLabel value={Players.COMPUTER} control={<Radio disabled={startStatus} />} label="Computer" />
                </RadioGroup>
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={6} style={{ paddingLeft: '0' }}>
                <Button variant="contained" onClick={onStartClick} disabled={startStatus}>Start/Repeat</Button>
              </Grid>
              <Grid item xs={6} style={{ paddingLeft: '0' }}>
                <Button variant="outlined" onClick={onStopClick}>Stop</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

    </>
  )
}

export default App
