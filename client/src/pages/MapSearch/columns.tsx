import { ColumnType } from 'antd/lib/table/interface';
import { Addr, Rental } from '../../model';
import { Button, Typography } from 'antd';

import { EyeInvisibleFilled, EyeInvisibleOutlined, GlobalOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { MutatorCallback, MutatorOptions } from 'swr';
import { RentalMapMarkerViewModel, toggleHidden, toggleStarred } from '../../net';
import produce from 'immer';

const m2Price = ({ rental: { area, rent } }: RentalMapMarkerViewModel) => {
  return Math.round(rent / Number.parseFloat(area));
};

export const useMapSearchColumns = (
  mutate: (
    data?: MutatorCallback<RentalMapMarkerViewModel[]>,
    opts?: boolean | MutatorOptions<RentalMapMarkerViewModel[]>,
  ) => Promise<RentalMapMarkerViewModel[] | undefined>,
): ColumnType<RentalMapMarkerViewModel>[] => {
  return [
    {
      title: '',
      dataIndex: '',
      width: '90px',
      render: (_, { id, hidden, starred }) => {
        const mutateFound = (fn: (rental: RentalMapMarkerViewModel) => void) => {
          mutate(
            (prev) =>
              produce(prev, (draft?: RentalMapMarkerViewModel[]) => {
                if (draft) {
                  fn(draft.find((e) => e.id === id)!);
                }
              }),
            false,
          ).catch(console.error);
        };

        return (
          <>
            <Button
              icon={starred ? <StarFilled /> : <StarOutlined />}
              type="text"
              onClick={() => {
                mutateFound((e) => {
                  e.starred = !e.starred;
                  toggleStarred(id, e.starred);
                });
              }}
            />
            <Button
              icon={hidden ? <EyeInvisibleFilled /> : <EyeInvisibleOutlined />}
              type="text"
              onClick={() => {
                mutateFound((e) => {
                  e.hidden = !e.hidden;
                  toggleHidden(id, e.hidden);
                });
              }}
            />
          </>
        );
      },
    },
    {
      title: '',
      dataIndex: ['rental'],
      width: '130px',
      render: ({ img, lnk }: Rental, { hidden }) => {
        if (hidden) return;
        if (!img) return;
        return (
          <Typography.Link href={`https://www.vuokraovi.com/${lnk}`} target="_blank">
            <img src={`https:${img}`} width={128} alt="rental" />
          </Typography.Link>
        );
      },
    },
    {
      title: 'Address',
      dataIndex: ['rental', 'addr'],
      width: '20%',
      render: ({ l1, l2, zip }: Addr & { zip?: string }, { lon, lat, hidden }) => {
        if (hidden) return l2;
        return (
          <>
            <Typography.Text>
              {zip ?? 'n/a'}, {l1}
            </Typography.Text>
            <br />
            <Typography.Text>{l2}</Typography.Text>
            <br />

            <Button
              type="link"
              icon={<GlobalOutlined />}
              style={{ padding: 0 }}
              onClick={() => {
                window.open(`https://maps.google.com/?q=${lat},${lon}`, 'blank');
              }}
            >
              {lat}, {lon}
            </Button>
          </>
        );
      },
    },
    {
      title: 'Rent',
      dataIndex: ['rental', 'rent'],
      width: '80px',
      sorter: (a, b) => Math.round(a.rental.rent) - Math.round(b.rental.rent),
      render: (rent: number) => {
        return <Typography.Text>€{Math.round(rent)}</Typography.Text>;
      },
    },
    {
      title: 'Area',
      dataIndex: ['rental', 'area'],
      width: '80px',
      sorter: (a, b) => Math.round(Number.parseFloat(a.rental.area)) - Math.round(Number.parseFloat(b.rental.area)),
      render: (area: string) => {
        return <Typography.Text>{Math.round(Number.parseFloat(area))}</Typography.Text>;
      },
    },
    {
      title: (
        <>
          per m<sup>2</sup>
        </>
      ),
      dataIndex: ['rental'],
      width: '100px',
      sorter: (a, b) => m2Price(a) - m2Price(b),
      render: (_, value) => {
        return <Typography.Text>€{m2Price(value)}</Typography.Text>;
      },
    },
    {
      title: 'Rooms',
      dataIndex: 'rooms',
      sorter: (a, b) => (a.rooms ?? 0) - (b.rooms ?? 0),
      width: '80px',
    },
    {
      title: 'Description',
      dataIndex: ['rental'],
      render: ({ rtype, htype, desc }: Rental, { hidden }) => {
        if (hidden) return desc;
        return (
          <>
            <Typography.Text>{desc ?? 'n/a'}</Typography.Text>
            <br />
            <Typography.Text>{rtype}</Typography.Text>
            <br />
            <Typography.Text>{htype}</Typography.Text>
          </>
        );
      },
    },
  ];
};
