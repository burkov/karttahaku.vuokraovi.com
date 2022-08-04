import React from 'react';
import { useRentalMapMarkerViewModels } from '../../net';
import { Col, Row, Table } from 'antd';
import { useMapSearchColumns } from './columns';
import styles from './index.module.css';
import './index.css'


export const MapSearchPage: React.FC = () => {
  const { data, mutate } = useRentalMapMarkerViewModels({
    zoom: 12,
    latNE: '61.120128337728254',
    latSW: '61.01183107946681',
    lonSW: '27.97756806237249',
    lonNE: '28.538214119501397',
  });
  const columns = useMapSearchColumns(mutate);
  return (
    <Row>
      <Col span={24}>
        <Table
          size="small"
          dataSource={data}
          columns={columns}
          loading={data === undefined}
          rowKey={(e) => e.id}
          rowClassName={({ starred }) => (starred ? styles.starredRow : '')}
        />
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
