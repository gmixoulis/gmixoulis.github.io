import React from 'react';
import { Animate } from 'react-move';
interface Props { valueStart?: number; valueEnd: number; duration: number; easingFunction: (t: number) => number; repeat?: boolean; children: (v: number) => React.ReactNode; }
interface State { isAnimated: boolean; }
class AnimatedProgressProvider extends React.Component<Props, State> {
  interval: ReturnType<typeof setInterval> | undefined;
  state: State = { isAnimated: false };
  static defaultProps = { valueStart: 0 };
  componentDidMount() {
    if (this.props.repeat) { this.interval = setInterval(() => this.setState({ isAnimated: !this.state.isAnimated }), this.props.duration * 1000); }
    else this.setState({ isAnimated: true });
  }
  componentWillUnmount() { if (this.interval) clearInterval(this.interval); }
  render() {
    const vs = this.props.valueStart ?? 0;
    return <Animate start={() => ({ value: vs })} update={() => ({ value: [this.state.isAnimated ? this.props.valueEnd : vs], timing: { duration: this.props.duration * 1000, ease: this.props.easingFunction } })}>
      {({ value }: { value: number }) => this.props.children(value)}
    </Animate>;
  }
}
export default AnimatedProgressProvider;
