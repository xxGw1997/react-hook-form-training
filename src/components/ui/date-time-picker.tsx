import { Button } from './button'
import { Popover, PopoverTrigger } from './popover'

export const DateTimePicker = () => {


  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button></Button>
        </PopoverTrigger>
    </Popover>
  )
}
