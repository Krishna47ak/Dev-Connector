import { Fragment } from 'react'
import spinner from './../../img/spinner.gif'

export default () => (
    <Fragment>
        <section className='container'>
            <img src={spinner} style={{ width: '100px', margin: 'auto', display: 'block' }} alt='Loading...' />
        </section>
    </Fragment>
)