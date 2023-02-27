import React from 'react';
import { DataTable } from "react-native-paper";
import { Scorecard } from "../../../hooks/useGame";
import { tableStyles } from './styles';

type Props = {
    scorecards: Scorecard[]
}
const TableNames = ({ scorecards }: Props) => {
    return (
        <DataTable style={{maxWidth: 110}}>
            <DataTable.Header>
                <DataTable.Title style={tableStyles.rank} textStyle={tableStyles.headerText}>#</DataTable.Title>
                <DataTable.Title style={tableStyles.player} textStyle={tableStyles.headerText}>Player</DataTable.Title>
            </DataTable.Header>

            {scorecards.map((sc, index) =>
                <DataTable.Row key={`dt-row-${sc.user.id}`}>
                    <DataTable.Cell style={tableStyles.rank} textStyle={tableStyles.scoreText}>{index+1}.</DataTable.Cell>
                    <DataTable.Cell style={tableStyles.player} textStyle={tableStyles.scoreText}>{sc.user.name}</DataTable.Cell>
                </DataTable.Row>
            )}
        </DataTable>
    );
};

export default TableNames;