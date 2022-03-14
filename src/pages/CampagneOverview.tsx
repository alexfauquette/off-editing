import * as React from 'react'
import { RouteComponentProps } from '@reach/router';
import {
    useQuery,
} from 'react-query'
import StepCard from '../components/StepCard'


interface CampagneAdminProps extends RouteComponentProps {
    campagne?: string
}

const titles = {
    "eco-carrefour": ["Select Image", "Annotate Image"]
}

const getEmptySteps = (campagne) => {
    if (!campagne || !titles[campagne]) {
        return []
    }
    return titles[campagne].map((title, step) => ({
        title,
        campagne,
        step,
        todo: 0,
        flagged: 0,
    }))
}

const CampagneOverview = ({ campagne }: CampagneAdminProps) => {

    const { isLoading, data } = useQuery(['campagneOverview', campagne], async () => {
        const response = await fetch(`https://amathjourney.com/api/off-annotation/overview/${campagne}`)
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = response.json()

        return data
    })

    const [steps, setSteps] = React.useState(getEmptySteps(campagne))

    React.useEffect(() => {
        if (data?.result) {
            setSteps(step => step.map(stepData => {
                const positiveCount = data.result.find(({ state, flag, count }) => state === stepData.step && flag)?.count
                const negativeCount = data.result.find(({ state, flag, count }) => state === stepData.step && !flag)?.count

                return { ...stepData, flagged: positiveCount ? parseInt(positiveCount) : 0, todo: negativeCount ? parseInt(negativeCount) : 0 }
            }))
        }
    }, [data])
    return <div>
        <p>campagne: {campagne}</p>
        <div>
            {steps.map(stepData => <StepCard key={`${stepData.campagne}-${stepData.step}`} isLoading={isLoading} {...stepData} />)}
        </div>

    </div>
}


export default CampagneOverview