import React from 'react';
import {useRentalMapMarkerViewModels} from '../../net';
import {Col, Row, Table, Typography} from 'antd';
import {useMapSearchColumns} from './columns';
import styles from './index.module.css';
import './index.css';
import {useSearchParams} from 'react-router-dom';

export const MapSearchPage: React.FC = () => {
  const [search, setSearch] = useSearchParams();
  const showHidden = search.get('showHidden') === 'true';
  const {data, mutate} = useRentalMapMarkerViewModels({
    zoom: 12,
    latNE: '61.120128337728254',
    latSW: '61.01183107946681',
    lonSW: '27.97756806237249',
    lonNE: '28.538214119501397',
  });
  const columns = useMapSearchColumns(mutate);
  const [shown, hidden] = data?.reduce(([s, h], {hidden}) => (hidden ? [s, h + 1] : [s + 1, h]), [0, 0]) ?? [0, 0];
  const dataSource = showHidden ? data?.filter((e) => e.hidden) : data?.filter((e) => !e.hidden);
  const toggleHidden = () => {
    const newParams = new URLSearchParams(search);
    newParams.set('showHidden', `${!showHidden}`);
    setSearch(newParams);
  };
  return (
    <Row>
      <Col span={24}>
        <div style={{display: 'flex', gap: '6px', alignItems: 'baseline'}}>
          <div>
            <Typography.Title level={3}>
              Showing {showHidden ? hidden : shown} {showHidden ? 'hidden ' : ''}rentals{' '}
            </Typography.Title>
          </div>
          <div>
            <Typography.Link onClick={toggleHidden}>
              ({showHidden ? shown : hidden} {showHidden ? 'non-hidden' : 'hidden'})
            </Typography.Link>
          </div>
        </div>
        <Table
          size="small"
          pagination={{position: ['topRight', 'bottomRight'], hideOnSinglePage: true}}
          dataSource={dataSource}
          columns={columns}
          loading={data === undefined}
          rowKey={(e) => e.id}
          rowClassName={({starred}) => (starred ? styles.starredRow : '')}
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
