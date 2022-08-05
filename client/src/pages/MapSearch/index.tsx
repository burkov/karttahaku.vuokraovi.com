import React from 'react';
import { useRentalMapMarkerViewModels } from '../../net';
import { Col, Row, Table, Tabs } from 'antd';
import { useMapSearchColumns } from './columns';
import styles from './index.module.css';
import './index.css';
import { useSearchParams } from 'react-router-dom';

export const MapSearchPage: React.FC = () => {
  const [search, setSearch] = useSearchParams();
  const showHidden = search.get('showHidden') === 'true';
  const { data, mutate } = useRentalMapMarkerViewModels({
    zoom: 12,
    latNE: '61.120128337728254',
    latSW: '61.01183107946681',
    lonSW: '27.97756806237249',
    lonNE: '28.538214119501397',
  });
  const columns = useMapSearchColumns(mutate);
  const hidden = data?.reduce((acc, { hidden }) => acc + (hidden ? 1 : 0), 0) ?? 0;
  const starred = data?.reduce((acc, { starred }) => acc + (starred ? 1 : 0), 0) ?? 0;
  const rest = (data?.length ?? 0) - hidden - starred;
  const dataSource = showHidden ? data?.filter((e) => e.hidden) : data?.filter((e) => !e.hidden);
  return (
    <Row>
      <Col span={24}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={`All (${rest})`} key="1">
            <Table
              size="small"
              pagination={{ position: ['topRight', 'bottomRight'], hideOnSinglePage: true }}
              dataSource={data?.filter((e) => !e.hidden && !e.starred)}
              columns={columns}
              loading={data === undefined}
              rowKey={(e) => e.rental.run}
              rowClassName={({ starred }) => (starred ? styles.starredRow : '')}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`Starred (${starred})`} key="2">
            <Table
              size="small"
              pagination={{ position: ['topRight', 'bottomRight'], hideOnSinglePage: true }}
              dataSource={data?.filter((e) => e.starred)}
              columns={columns}
              loading={data === undefined}
              rowKey={(e) => e.rental.run}
              rowClassName={({ starred }) => (starred ? styles.starredRow : '')}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`Hidden (${hidden})`} key="3">
            <Table
              size="small"
              pagination={{ position: ['topRight', 'bottomRight'], hideOnSinglePage: true }}
              dataSource={data?.filter((e) => e.hidden)}
              columns={columns}
              loading={data === undefined}
              rowKey={(e) => e.rental.run}
              rowClassName={({ starred }) => (starred ? styles.starredRow : '')}
            />
          </Tabs.TabPane>
        </Tabs>
      </Col>
      {/*<Col span={12}>*/}
      {/*  <div>*/}
      {/*    <MyMapComponent*/}
      {/*      isMarkerShown*/}
      {/*      googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"*/}
      {/*      loadingElement={<div style={{ height: `100%` }} />}*/}
      {/*      containerElement={<div style={{ height: `400px` }} />}*/}
      {/*      mapElement={<div style={{ height: `100%` }} />}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</Col>*/}
    </Row>
  );
};
