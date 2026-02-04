import { NextRequest, NextResponse } from 'next/server';

// Mock notifications for demo
const mockNotifications = [
  {
    id: 'notif_1',
    type: 'ally_action',
    title: 'Ally processed your emails',
    message: 'I sorted 23 emails, flagged 3 as important, and drafted 2 replies for your review.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'unread',
    priority: 'normal',
    source: { type: 'ally', name: 'Ally', avatar: '🤖' },
  },
  {
    id: 'notif_2',
    type: 'feature',
    title: 'New: Voice Commands',
    message: 'You can now talk to Ally using voice commands! Try saying "Hey Ally".',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'unread',
    priority: 'low',
  },
  {
    id: 'notif_3',
    type: 'task_completed',
    title: 'Meeting scheduled',
    message: 'Meeting with Sarah scheduled for tomorrow at 2 PM.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'read',
    priority: 'normal',
    source: { type: 'ally', name: 'Ally', avatar: '🤖' },
  },
];

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'unread', 'read', 'all'
    const type = searchParams.get('type'); // notification type filter
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Get user from auth session
    // const session = await getSession(request);
    // const userId = session?.user?.id;

    // Filter notifications
    let filtered = [...mockNotifications];

    if (status && status !== 'all') {
      filtered = filtered.filter(n => n.status === status);
    }

    if (type) {
      filtered = filtered.filter(n => n.type === type);
    }

    // Apply pagination
    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      notifications: paginated,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error('[Notifications] Error fetching:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications - Bulk update notifications
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, status } = body;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Notification IDs required' },
        { status: 400 }
      );
    }

    if (!status || !['read', 'unread', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status required (read, unread, archived)' },
        { status: 400 }
      );
    }

    // TODO: Update notifications in database
    console.log('[Notifications] Bulk update:', { ids, status });

    return NextResponse.json({
      success: true,
      updated: ids.length,
    });
  } catch (error) {
    console.error('[Notifications] Error updating:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications - Delete notifications
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all') === 'true';

    if (!id && !all) {
      return NextResponse.json(
        { error: 'Notification ID or all=true required' },
        { status: 400 }
      );
    }

    // TODO: Delete notifications from database
    console.log('[Notifications] Delete:', { id, all });

    return NextResponse.json({
      success: true,
      message: all ? 'All notifications deleted' : `Notification ${id} deleted`,
    });
  } catch (error) {
    console.error('[Notifications] Error deleting:', error);
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    );
  }
}
