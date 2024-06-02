import React from 'react';
import { DataTable } from 'react-native-paper';
import { scoreColor, tableStyles } from './styles';
import { Scorecard } from '../../../types/game';

type Props = {
    scorecards: Scorecard[]
    pars: number[]
    showBeers?: boolean
}

const TableScores = ({ scorecards, pars, showBeers }: Props) => {
    const showBeersInfo = showBeers || scorecards.some(sc => sc.beers > 0);
    return (
        <DataTable>
            <DataTable.Header>
                {pars.map((par, index) =>
                    <DataTable.Title key={`dt-score-${index}`} style={tableStyles.score} textStyle={tableStyles.headerText}>
                        {index+1}
                    </DataTable.Title>
                )}
                <DataTable.Title style={tableStyles.total}>Total</DataTable.Title>
                <DataTable.Title style={tableStyles.total}>+/-</DataTable.Title>
                <DataTable.Title style={tableStyles.total}>Hc</DataTable.Title>
                {showBeersInfo && (
                    <>
                    <DataTable.Title style={tableStyles.total}>Beers</DataTable.Title>
                    <DataTable.Title style={tableStyles.total}>bHc</DataTable.Title>
                    </>
                )}
                <DataTable.Title style={tableStyles.totalPlusMinus} textStyle={tableStyles.totalText}>Tot +/-</DataTable.Title>
            </DataTable.Header>
            {scorecards.map(sc =>
                <DataTable.Row key={`dt-row-${sc.user.id}`}>
                    {pars.map((par, index) => {
                        const score = sc.scores[index];
                        return (
                            <DataTable.Cell
                                key={`score-${index}`}
                                style={[tableStyles.score, {backgroundColor: score ? scoreColor(score - par) : undefined}]}
                                textStyle={tableStyles.scoreText}
                            >
                                {score ?? ''}
                            </DataTable.Cell>
                        );
                    })}
                    <DataTable.Cell style={tableStyles.total} textStyle={tableStyles.scoreText}>{sc.total}</DataTable.Cell>
                    <DataTable.Cell style={tableStyles.total} textStyle={tableStyles.scoreText}>{sc.plusminus}</DataTable.Cell>
                    <DataTable.Cell style={tableStyles.total} textStyle={tableStyles.scoreText}>{sc.hc}</DataTable.Cell>
                    {showBeersInfo && (
                        <>
                            <DataTable.Title style={tableStyles.total} textStyle={tableStyles.scoreText}>{sc.beers}</DataTable.Title>
                            <DataTable.Title style={tableStyles.total} textStyle={tableStyles.scoreText}>{sc.beers * 0.5}</DataTable.Title>
                        </>
                    )}
                    <DataTable.Title style={tableStyles.totalPlusMinus} textStyle={tableStyles.totalText}>{(sc.plusminus || 0) - sc.hc - (sc.beers * 0.5 * (showBeersInfo ? 1 : 0))}</DataTable.Title>

                </DataTable.Row>
            )}
        </DataTable>
    );
};

export default TableScores;
