import type { Meta, StoryObj } from '@storybook/react'
import {
  Skeleton,
  PostSkeleton,
  FeedSkeleton,
  ProfileSkeleton,
  ProfileListSkeleton,
  CardSkeleton,
  TimelineSkeleton,
  SidebarSkeleton
} from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    className: 'h-4 w-32',
  },
}

export const Circle: Story = {
  args: {
    className: 'h-12 w-12 rounded-full',
  },
}

export const Rectangle: Story = {
  args: {
    className: 'h-32 w-full',
  },
}

export const Post: StoryObj = {
  render: () => <PostSkeleton />,
}

export const Feed: StoryObj = {
  render: () => <FeedSkeleton count={3} />,
}

export const Profile: StoryObj = {
  render: () => <ProfileSkeleton />,
}

export const ProfileList: StoryObj = {
  render: () => <ProfileListSkeleton count={3} />,
}

export const Card: StoryObj = {
  render: () => <CardSkeleton />,
}

export const Timeline: StoryObj = {
  render: () => <TimelineSkeleton />,
}

export const Sidebar: StoryObj = {
  render: () => (
    <div className="max-w-xs">
      <SidebarSkeleton />
    </div>
  ),
}
