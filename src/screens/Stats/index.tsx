import { useQuery } from 'react-apollo';
import React from 'react';
import { Text } from 'react-native';
import { Paragraph, Title } from 'react-native-paper';
import Loading from '../../components/Loading';
import Container from '../../components/ThemedComponents/Container';
import { GET_STATS } from '../../graphql/queries';

const Stats = () => {
    const { data, loading: l2 } = useQuery(GET_STATS);
    if (l2) return <Loading />;
    return (
        <Container>
            <Title>Stats</Title>
            <Paragraph>
                Course: (Malmis / Main)
            </Paragraph>
            <Text>Games: {data.getHc[0].games}</Text>
            <Text>Hc: {data.getHc[0].hc}</Text>
            <Text>Scores: {data.getHc[0].scores.join(', ')} </Text>
        </Container>
    );
};

export default Stats;