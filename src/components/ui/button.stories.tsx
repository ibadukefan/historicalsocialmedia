import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import { Heart, Bookmark, Share } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
}

export const WithIcon: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
    children: <Heart className="h-4 w-4" />,
  },
}

export const IconGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon">
        <Heart className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Bookmark className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Share className="h-4 w-4" />
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
}

export const Loading: Story = {
  render: () => (
    <Button disabled>
      <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
      Loading...
    </Button>
  ),
}
