import React, { useEffect, useState } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

const PayChart2 = () => {
    const [sum, setSum] = useState([]);
    const [loading, setLoading] = useState(false);

    const getSum = async () => {
        setLoading(true);
        const use_work_num = 1288663802;
        const result = await axios.get(`/payroll/month?use_work_num=${use_work_num}`);
        setSum(result.data);
        setLoading(false);
        console.log(sum);
    };

    useEffect(()=>{
        getSum();
    },[]);


    if (loading) return <Spinner animation='border' className='position-absolute top-50 start-50' />
    return (
        // chart height이 100%이기 때문이 chart를 덮는 마크업 요소에 height 설정
        <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
            <ResponsiveBar
                /**
                 * chart에 사용될 데이터
                 */
                data={sum}
                /**
                 * chart에 보여질 데이터 key (측정되는 값)
                 */
                keys={['월별통계']}
                /**
                 * keys들을 그룹화하는 index key (분류하는 값)
                 */
                indexBy="pay_month"
                /**
                 * chart margin
                 */
                margin={{ top: 80, right: 50, bottom: 50, left: 100 }}
                /**
                 * chart padding (bar간 간격)
                 */
                padding={0.4}
                /**
                 * chart 색상
                 */
                colors={['skyblue']} // 커스터하여 사용할 때
                // colors={{ scheme: 'nivo' }} // nivo에서 제공해주는 색상 조합 사용할 때
                /**
                 * color 적용 방식
                 */
                colorBy="id" // 색상을 keys 요소들에 각각 적용
                // colorBy="indexValue" // indexBy로 묵인 인덱스별로 각각 적용
                theme={{
                    /**
                     * label style (bar에 표현되는 글씨)
                     */
                    labels: {
                        text: {
                            fontSize: 14,
                            fill: '#000000',
                        },
                    },
                    /**
                     * legend style (default로 우측 하단에 있는 색상별 key 표시)
                     */
                    legends: {
                        text: {
                            fontSize: 12,
                            fill: '#000000',
                        },
                    },
                    axis: {
                        /**
                         * axis legend style (bottom, left에 있는 글씨)
                         */
                        legend: {
                            text: {
                                fontSize: 10,
                                fill: '#000000',
                            },
                        },
                        /**
                         * axis ticks style (bottom, left에 있는 값)
                         */
                        ticks: {
                            text: {
                                fontSize: 10,
                                fill: '#000000',
                            },
                        },
                    },
                }}
                /**
                 * axis bottom 설정
                 */
                axisBottom={{
                    tickSize: 5, // 값 설명하기 위해 튀어나오는 점 크기
                    tickPadding: 5, // tick padding
                    tickRotation: 0, // tick 기울기
                    legend: 'month', // bottom 글씨
                    legendPosition: 'middle', // 글씨 위치
                    legendOffset: 30, // 글씨와 chart간 간격
                }}
                /**
                 * axis left 설정
                 */
                axisLeft={{
                    tickSize: 5, // 값 설명하기 위해 튀어나오는 점 크기
                    tickPadding: 5, // tick padding
                    tickRotation: 0, // tick 기울기
                    legend: 'pay', // left 글씨
                    legendPosition: 'middle', // 글씨 위치
                    legendOffset: -60, // 글씨와 chart간 간격
                }}
                /**
                 * label 안보이게 할 기준 width
                 */
                labelSkipWidth={36}
                /**
                 * label 안보이게 할 기준 height
                 */
                labelSkipHeight={12}
                /**
                 * bar 클릭 이벤트
                 */
                //onClick={handle.barClick}
                /**
                 * legend 설정 (default로 우측 하단에 있는 색상별 key 표시)
                 */
                
            />
        </div>
    );
};

export default PayChart2