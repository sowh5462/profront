import React, { useEffect, useState } from "react";
import { ResponsivePie } from '@nivo/pie';
import axios from "axios";
import { Spinner } from "react-bootstrap";

const PayChart = () => {
    const [type, setType] = useState([]);
    const [loading, setLoading] = useState(false);

    const getType = async () => {
        setLoading(true);
        const use_work_num = sessionStorage.getItem("use_work_num");
        const result4 = await axios.get(`/payroll/type?use_work_num=${use_work_num}`);
        setType(result4.data);
        setLoading(false);
    };

    useEffect(() => {
        getType();
    }, []);

    const modifiedData = type.map((item) => {
        let label;
        switch (item.sta_type) {
            case 0:
                label = "정규직";
                break;
            case 1:
                label = "계약직";
                break;
            case 2:
                label = "일용직";
                break;
            default:
                label = "";
                break;
        }
        return {
            ...item,
            sta_type: label,
        };
    });


    if (loading) return <Spinner animation='border' className='position-absolute top-50 start-50' />
    return (
        // chart height이 100%이기 때문이 chart를 덮는 마크업 요소에 height 설정
        <div style={{ width: '400px', height: '400px', margin: '0 auto' }}>
            <ResponsivePie
                /**
                 * chart에 사용될 데이터
                 */
                data={modifiedData}
                id="sta_type"
                value="count"
                /**
                 * chart margin
                 */
                margin={{ top: 80, right: 80, bottom: 80, left: 80 }}
                /**
                 * chart 중간 빈공간 반지름
                 */
                innerRadius={0.5}
                /**
                 * pad 간격
                 */
                padAngle={0}
                /**
                 * pad radius 설정 (pad별 간격이 있을 시 보임)
                 */
                cornerRadius={0}
                /**
                 * chart 색상
                 */
                colors={['#0064CD', '#0078FF', '#87AFEB']} // 커스터하여 사용할 때
                // colors={{ scheme: 'nivo' }} // nivo에서 제공해주는 색상 조합 사용할 때
                /**
                 * pad border 두께 설정
                 */
                borderWidth={2}
                /**
                 * link label skip할 기준 각도
                 */
                arcLinkLabelsSkipAngle={360}
                /**
                 * link label 색상
                 */
                arcLinkLabelsTextColor="#000000"
                /**
                 * link label 연결되는 선 두께
                 */
                arcLinkLabelsThickness={2}
                /**
                 * link label 연결되는 선 색상
                 */
                arcLinkLabelsColor={{ from: 'color' }} // pad 색상에 따라감
                /**
                 * label (pad에 표현되는 글씨) skip할 기준 각도
                 */
                arcLabelsSkipAngle={360}
                theme={{
                    /**
                     * label style (pad에 표현되는 글씨)
                     */
                    labels: {
                        text: {
                            fontSize: 14,
                            fill: '#000000',
                        },
                    },
                    /**
                     * legend style (default로 하단에 있는 색상별 key 표시)
                     */
                    legends: {
                        text: {
                            fontSize: 12,
                            fill: '#000000',
                        },
                    },
                }}
                /**
                 * pad 클릭 이벤트
                 */
                //onClick={handle.padClick}
                /**
                 * legend 설정 (default로 하단에 있는 색상별 key 표시)
                 */
                legends={[
                    {
                        anchor: 'bottom', // 위치
                        direction: 'row', // item 그려지는 방향
                        justify: false, // 글씨, 색상간 간격 justify 적용 여부
                        translateX: 0, // chart와 X 간격
                        translateY: 56, // chart와 Y 간격
                        itemsSpacing: 0, // item간 간격
                        itemWidth: 100, // item width
                        itemHeight: 18, // item height
                        itemDirection: 'left-to-right', // item 내부에 그려지는 방향
                        itemOpacity: 1, // item opacity
                        symbolSize: 18, // symbol (색상 표기) 크기
                        symbolShape: 'circle', // symbol (색상 표기) 모양
                        effects: [
                            {
                                // 추가 효과 설정 (hover하면 textColor를 olive로 변경)
                                on: 'hover',
                                style: {
                                    itemTextColor: 'olive',
                                },
                            },
                        ],
                        //onClick: handle.legendClick, // legend 클릭 이벤트
                    },
                ]}
            />
        </div>
    );
};

export default PayChart