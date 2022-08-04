import React from 'react';
import {MapSearchPage} from './pages/MapSearch';
import {Col, Layout, Row, Typography} from 'antd';

function App() {
  return (
    <Layout>
      <Layout.Header>
        <Typography.Title style={{color: "white", margin: "6px 0 0 0"}}>Rental finder 9000</Typography.Title>
      </Layout.Header>
      <Layout.Content style={{padding: '12px 48px 0 48px'}}>
        <MapSearchPage/>
      </Layout.Content>
    </Layout>
  );
}

export default App;
