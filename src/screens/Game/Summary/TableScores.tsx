import React from 'react';
import { DataTable } from 'react-native-paper';
import { Scorecard } from '../../../hooks/useGame';
import { scoreColor, tableStyles } from './styles';

type Props = {
    scorecards: Scorecard[]
    pars: number[]
    showBeers: boolean
}

const TableScores = ({ scorecards, pars, showBeers=false }: Props) => {
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
                <DataTable.Title style={tableStyles.hcPlusMinus}>Hc +/-</DataTable.Title>
                {showBeers && (
                    <>
                    <DataTable.Title style={tableStyles.total}>Beers</DataTable.Title>
                    <DataTable.Title style={tableStyles.total}>bHc</DataTable.Title>
                    <DataTable.Title style={tableStyles.hcPlusMinus}>bHc +/-</DataTable.Title>
                    </>
                )}
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
                    <DataTable.Cell style={tableStyles.hcPlusMinus} textStyle={tableStyles.scoreText}>{(sc.plusminus || 0) - sc.hc}</DataTable.Cell>
                    {showBeers && (
                    <>
                    <DataTable.Title style={tableStyles.total} textStyle={tableStyles.scoreText}>{sc.beers}</DataTable.Title>
                    <DataTable.Title style={tableStyles.total} textStyle={tableStyles.scoreText}>{sc.beers * 0.5}</DataTable.Title>
                    <DataTable.Title style={tableStyles.hcPlusMinus} textStyle={tableStyles.scoreText}>{(sc.plusminus || 0) - (sc.beers * 0.5)}</DataTable.Title>
                    </>
                )}

                </DataTable.Row>
            )}
        </DataTable>
    );
};

export default TableScores;
